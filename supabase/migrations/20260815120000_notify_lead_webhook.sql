-- Fire the notify-lead Edge Function on every insert into public.leads.
--
-- Before applying, store the two values this trigger needs in Vault. Run once,
-- in the SQL editor, substituting the real service_role key:
--
--   select vault.create_secret(
--     'https://quaaryejzudmuclgpjmr.supabase.co/functions/v1/notify-lead',
--     'notify_lead_function_url'
--   );
--   select vault.create_secret('<service_role_key>', 'notify_lead_service_key');
--
-- The key lives in Vault rather than inline here so it never enters the repo or
-- the migration history.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_lead_on_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_function_url text;
  v_service_key  text;
begin
  select decrypted_secret into v_function_url
    from vault.decrypted_secrets
   where name = 'notify_lead_function_url';

  select decrypted_secret into v_service_key
    from vault.decrypted_secrets
   where name = 'notify_lead_service_key';

  if v_function_url is null or v_service_key is null then
    raise warning 'notify_lead_on_insert: Vault secrets missing, no notification sent for lead %',
      new.id;
    return null;
  end if;

  -- pg_net queues the request and returns immediately, so the insert is never
  -- held open waiting on Resend.
  perform net.http_post(
    url     := v_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_key
    ),
    body    := jsonb_build_object(
      'type', 'INSERT',
      'table', tg_table_name,
      'schema', tg_table_schema,
      'record', to_jsonb(new),
      'old_record', null
    ),
    timeout_milliseconds := 5000
  );

  return null;
exception
  when others then
    -- The row is the thing that matters. If queueing the notification fails for
    -- any reason, log it and let the insert stand.
    raise warning 'notify_lead_on_insert failed for lead %: %', new.id, sqlerrm;
    return null;
end;
$$;

comment on function public.notify_lead_on_insert() is
  'AFTER INSERT trigger on public.leads: queues a call to the notify-lead Edge Function via pg_net. Never raises — a notification failure must not roll back the lead.';

drop trigger if exists notify_lead_after_insert on public.leads;

create trigger notify_lead_after_insert
  after insert on public.leads
  for each row
  execute function public.notify_lead_on_insert();

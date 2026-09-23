import * as migration_20260922_024735_initial from './20260922_024735_initial';
import * as migration_20260922_074832_landing_settings from './20260922_074832_landing_settings';
import * as migration_20260922_170500_whyus_icon_upload from './20260922_170500_whyus_icon_upload';
import * as migration_20260922_171500_certs_certificate_rename from './20260922_171500_certs_certificate_rename';
import * as migration_20260922_180000_continue_label from './20260922_180000_continue_label';
import * as migration_20260923_040329_pages_enquiries from './20260923_040329_pages_enquiries';
import * as migration_20260923_051200_events_career_projects from './20260923_051200_events_career_projects';
import * as migration_20260923_075152_services_pages from './20260923_075152_services_pages';
import * as migration_20260923_100000_service_item_icons from './20260923_100000_service_item_icons';
import * as migration_20260923_110000_service_why_choose_us from './20260923_110000_service_why_choose_us';

export const migrations = [
  {
    up: migration_20260922_024735_initial.up,
    down: migration_20260922_024735_initial.down,
    name: '20260922_024735_initial',
  },
  {
    up: migration_20260922_074832_landing_settings.up,
    down: migration_20260922_074832_landing_settings.down,
    name: '20260922_074832_landing_settings',
  },
  {
    up: migration_20260922_170500_whyus_icon_upload.up,
    down: migration_20260922_170500_whyus_icon_upload.down,
    name: '20260922_170500_whyus_icon_upload',
  },
  {
    up: migration_20260922_171500_certs_certificate_rename.up,
    down: migration_20260922_171500_certs_certificate_rename.down,
    name: '20260922_171500_certs_certificate_rename',
  },
  {
    up: migration_20260922_180000_continue_label.up,
    down: migration_20260922_180000_continue_label.down,
    name: '20260922_180000_continue_label',
  },
  {
    up: migration_20260923_040329_pages_enquiries.up,
    down: migration_20260923_040329_pages_enquiries.down,
    name: '20260923_040329_pages_enquiries',
  },
  {
    up: migration_20260923_051200_events_career_projects.up,
    down: migration_20260923_051200_events_career_projects.down,
    name: '20260923_051200_events_career_projects',
  },
  {
    up: migration_20260923_075152_services_pages.up,
    down: migration_20260923_075152_services_pages.down,
    name: '20260923_075152_services_pages'
  },
  {
    up: migration_20260923_100000_service_item_icons.up,
    down: migration_20260923_100000_service_item_icons.down,
    name: '20260923_100000_service_item_icons',
  },
  {
    up: migration_20260923_110000_service_why_choose_us.up,
    down: migration_20260923_110000_service_why_choose_us.down,
    name: '20260923_110000_service_why_choose_us',
  },
];

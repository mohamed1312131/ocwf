/**
 * Central place for the app download links and related constants.
 *
 * IMPORTANT: the URLs below are PLACEHOLDERS.
 * TODO(store-urls): replace with the real Apple App Store and Google Play links.
 * TODO(ios-app-id): set IOS_APP_ID so the apple-itunes-app meta tag and the QR
 * target can be finalised.
 */

export const APP_STORE_URL = 'https://apps.apple.com/app/id0000000000'; // TODO: real App Store URL
export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=tn.omnicare.app'; // TODO: real Google Play URL

/** Numeric iOS app id used by the Apple smart app banner. Empty until provided. */
export const IOS_APP_ID = ''; // TODO: e.g. "1234567890"

/** Default QR target — usually the store link. Confirmed before launch. */
export const QR_TARGET_URL = APP_STORE_URL; // TODO: confirm QR target

/** Built by OmniLinks. */
export const COMPANY_NAME = 'OmniLinks';
export const CONTACT_EMAIL = 'contact@omnicare.tn';

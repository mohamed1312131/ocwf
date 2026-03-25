/**
 * Configuration Cloudflare Turnstile
 * 
 * Pour la production, remplacez 'YOUR_SITE_KEY' par votre vraie clé de site Cloudflare Turnstile.
 * 
 * Clés de test disponibles :
 * - '1x00000000000000000000AA' : Toujours réussit (recommandé pour le développement)
 * - '2x00000000000000000000AB' : Toujours échoue (pour tester les erreurs)
 * - '3x00000000000000000000FF' : Force un défi interactif
 * 
 * Pour obtenir votre clé de site :
 * 1. Connectez-vous à votre tableau de bord Cloudflare
 * 2. Allez dans "Turnstile"
 * 3. Créez un nouveau site
 * 4. Copiez la clé de site (Site Key)
 * 
 * Important : La clé de site peut être publique (côté client), 
 * mais la clé secrète doit rester sur le serveur.
 */

// Use test key for localhost development, production key for deployment
export const TURNSTILE_SITE_KEY = '1x00000000000000000000AA'; // Test key (always passes)
// Production key: 0x4AAAAAACtXYK5ypU3kp-JP (use when deploying)

/**
 * Options de configuration pour le widget Turnstile
 */
export const TURNSTILE_OPTIONS = {
  theme: 'light' as const,
  size: 'normal' as const,
};

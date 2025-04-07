import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<'reverb'> | null = null;

if (typeof window !== 'undefined') {
  // windowオブジェクトが存在する場合、つまりブラウザ環境でのみ実行される
  window.Pusher = Pusher;
  echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    cluster: 'mt1',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: false,
    disableStats: true,
    encrypted: false,
  });
}

export default echo;

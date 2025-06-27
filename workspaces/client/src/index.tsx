import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { ClientApp } from '@wsh-2024/app/src/index';

import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  // Service Workerを最初に登録
  await registerServiceWorker().catch(console.error);
  
  // DOMが既に読み込まれている場合は即座に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateApp, { once: true });
  } else {
    hydrateApp();
  }
};

const hydrateApp = () => {
  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <SWRConfig value={{ revalidateIfStale: true, revalidateOnFocus: false, revalidateOnReconnect: false }}>
      <BrowserRouter>
        <ClientApp />
      </BrowserRouter>
    </SWRConfig>,
  );
};

main();

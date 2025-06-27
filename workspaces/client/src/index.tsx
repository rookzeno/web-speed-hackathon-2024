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
  const injectDataElement = document.getElementById('inject-data');
  let fallback = {};
  
  if (injectDataElement && injectDataElement.textContent) {
    try {
      fallback = JSON.parse(injectDataElement.textContent);
    } catch (error) {
      console.error('Failed to parse inject data:', error);
    }
  }
  
  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <SWRConfig value={{ 
      fallback,
      revalidateIfStale: true, 
      revalidateOnFocus: false, 
      revalidateOnReconnect: false 
    }}>
      <BrowserRouter>
        <ClientApp />
      </BrowserRouter>
    </SWRConfig>,
  );
};

main();

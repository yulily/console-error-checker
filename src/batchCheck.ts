import { chromium, ConsoleMessage } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// 検索対象のエラーテキスト（環境変数から取得）
const TARGET_ERROR = process.env.TARGET_ERROR;

// URLからファイル名を生成する関数
function createFilename(url: string): string {
  const urlObj = new URL(url);
  const safePath = `${urlObj.hostname}${urlObj.pathname}`
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  return `${safePath}.txt`;
}

async function checkUrl(url: string): Promise<string[]> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors: string[] = [];
  
  // コンソールメッセージの監視を設定
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    // ページの読み込みが完了するまで少し待機
    await page.waitForTimeout(2000);
  } catch (error: any) {
    errors.push(`Navigation error: ${error.message}`);
  }

  await browser.close();
  return errors;
}

async function main() {
  try {
    // 実行時の設定を表示
    if (TARGET_ERROR) {
      console.log(`Checking for specific error pattern: "${TARGET_ERROR}"\n`);
    } else {
      console.log('Checking for all console errors\n');
    }

    // URLリストの読み込み
    const urls = readFileSync('urls.txt', 'utf-8')
      .split('\n')
      .filter(url => url.trim());

    for (const url of urls) {
      console.log(`Checking URL: ${url}`);
      
      const errors = await checkUrl(url);
      const hasError = TARGET_ERROR 
        ? errors.some(error => error.includes(TARGET_ERROR))
        : errors.length > 0;
      
      // 結果の出力
      console.log(`Status: ${hasError ? '❌ Error found' : '✅ No error'}`);
      
      // 結果をファイルに保存
      const filename = resolve('results', createFilename(url));
      const content = errors.length > 0 
        ? errors.join('\n')
        : '[no console errors]';
      
      writeFileSync(filename, content);
    }

    console.log('\nCheck completed! Results have been saved to the results directory.');
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

main();
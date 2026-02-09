<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1lQra3P9BYSWE6L3MTowjkTTubyIfhHl-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Vue项目说明：

按照以上步骤，先install依赖，再设置GEMINI_API_KEY，最后运行项目（run dev）。
运行项目时，会自动打开浏览器，并访问http://localhost:3000/。

打包项目的命令是：npm run build

### 执行过程分析

1. 终端输入 npm run dev -> 调用本地 vite 软件。
2. vite 寻找并读取 vite.config.ts。
3. vite 扫描 index.html 发现 
```html
<script type="module" src="/index.tsx">
```
，代码从这里开始执行。

4. 浏览器请求 /index.tsx，而这个文件中又引用了 App.tsx。
5. vite 使用 esbuild 将 index.tsx、App.tsx 等 TS 代码实时转译为 JS 发给浏览器。
6. App.tsx 里的 React 代码开始在浏览器中运行。

### 更多内容

[https://my.feishu.cn/docx/MBNedhToDopGRsxKgxIciN7wneS](https://my.feishu.cn/docx/MBNedhToDopGRsxKgxIciN7wneS)


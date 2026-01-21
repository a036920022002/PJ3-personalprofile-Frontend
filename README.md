# Personal Hub Pro - Frontend (Vue.js)
###### PJ3-personalprofile-frontend (C #)

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Zeabur](https://img.shields.io/badge/Zeabur-000000?style=for-the-badge&logo=zeabur&logoColor=white)

本專案是以專為開發者設計的個人介紹與作品集管理系統。
此資料庫為專案的客戶端介面，配合後端以「C# / ASP.NET Core」重構緊密整合。在維持優質 SPA 體驗的同時，重點優化了前後端通訊協定，以適應更嚴謹的企業級後端架構。

## 🚀 重構適應與技術亮點
* **API 對接重構**：配合後端從 Node.js 遷移至 C#，全面調整 Axios 請求模組，以符合 ASP.NET Core 的 RESTful 規範與強型別資料交換格式。
* **資料模型同步**：前端資料結構精確對接後端的 **DTO (Data Transfer Object)**，確保在複雜資料存取（如教育背景與專案關聯）時的資料完整性。
* **異步讀取優化**：優化前端加載邏輯，完美適應後端 **Async/Await** 非同步處理機制，提升整體頁面渲染效能。
* **SPA 無縫體驗**：延續 Vue.js 組件化優點，確保使用者在系統後端發生重大遷移時，前端操作體驗維持一致且無感升級。

## 🛠 主要功能
* **動態履歷渲染**：從 C# Web API 即時獲取並展示最新的專業經歷。
* **全端整合測試**：驗證跨平台（Vue + .NET Core）的連線穩定性與效能。

## 🔗 相關連結
* **Live Demo**： [點此查看成品](https://myprofilebycsharp.zeabur.app/homepage)
* **[BackEnd Link](https://github.com/a036920022002/PJ3-BackEnd.git)**

## 🌟How Start
```npm init```  
```npm run dev```

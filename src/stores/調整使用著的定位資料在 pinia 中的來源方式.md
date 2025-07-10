調整使用著的定位資料在 pinia 中的來源方式
以後在line 登入後會獲得 UUID 之後在用 uuid 查詢可以獲得一個 json 資料
並利用下面的服務撈取做顯示資料
資料格式如下
```
{
  "ServiceInfo": [
    {
      "name": "哆啦美容美體中心",
      "tel": "123-456-7890",
      "cell": "098-765-4321",
      "lineLink": "https://line.me/ti/p/1234567890",
      "address": {
        "street": "123 Example St",
        "city": "Example City",
        "state": "EX",
        "zip": "12345"
      },
      "services": [
        {
          "service_name": "深層清潔護膚療程",
          "service_ID": "SB001",
          "amount": 1500,
          "status": "completed",

          "date": "2023-10-01",
          "timeStart": "10:00 AM",
          "timeEnd": "11:30 AM",

          "description": "90分鐘深層清潔護膚療程",
          "notes": "效果很好，皮膚變得更光滑"
        },

        {
          "service_name": "全身按摩",
          "service_ID": "SB002",
          "amount": 2000,
          "status": "scheduled",
          "date": "2025-08-05",
          "timeStart": "02:00 PM",
          "timeEnd": "03:00 PM",
          "description": "60分鐘全身放鬆按摩",
          "notes": "需要特別注意肩頸部位"
        },
        {
          "service_name": "美甲服務",
          "service_ID": "SB003",
          "amount": 800,
          "status": "completed",
          "date": "2023-10-10",
          "timeStart": "11:00 AM",
          "timeEnd": "12:00 PM",
          "description": "美甲和手部護理服務",
          "notes": ""
        }
      ]
    },
    {
      "name": "大肌肌健身房",
      "tel": "987-654-3210",
      "cell": "012-345-6789",
      "lineLink": "https://line.me/ti/p/0987654321",
      "address": {
        "street": "456 Sample Ave",
        "city": "Sample City",
        "state": "SA",
        "zip": "67890"
      },
      "services": [
        {
          "service_name": "個人訓練課程",
          "service_ID": "SB004",
          "amount": 2500,
          "status": "scheduled",
          "date": "2025-08-10",
          "timeStart": "09:00 AM",
          "timeEnd": "10:00 AM",
          "description": "60分鐘個人訓練課程",
          "notes": "需要攜帶運動鞋和水壺"
        },
        {
          "service_name": "瑜伽課程",
          "service_ID": "SB005",
          "amount": 1200,
          "status": "completed",
          "date": "2023-10-15",
          "timeStart": "06:00 PM",
          "timeEnd": "07:00 PM",
          "description": "60分鐘瑜伽放鬆課程",
          "notes": ""
        }
      ]
    }
  ]
}
```
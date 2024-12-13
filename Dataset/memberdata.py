import pandas as pd
from geopy.geocoders import Nominatim
import json
import time

# 初始化地理定位器
geolocator = Nominatim(user_agent="your_app_name")

# 读取 Excel 文件
df = pd.read_excel('public/Dataset/members.xlsx')

# 提取年份和国家信息
data_list = []
for index, row in df.iterrows():
    year = row.iloc[3]  # 使用 iloc 访问位置
    country = row.iloc[7]  # 使用 iloc 访问位置
    
    # 获取国家的经纬度
    try:
        location = geolocator.geocode(country)
        if location:
            coordinates = [location.longitude, location.latitude]
        else:
            coordinates = [None, None]  # 如果找不到经纬度，设置为 None
    except Exception as e:
        print(f"Error geocoding {country}: {e}")
        coordinates = [None, None]
    
    # 统计每个国家的出现次数
    existing_entry = next((item for item in data_list if item['year'] == year and item['country'] == country), None)
    if existing_entry:
        existing_entry['count'] += 1
    else:
        data_list.append({
            'year': year,
            'country': country,
            'coordinates': coordinates,
            'count': 1
        })
    
    # 添加请求延迟
    time.sleep(1)  # 延迟1秒

# 将结果保存为 JSON 文件
with open('member.json', 'w', encoding='utf-8') as f:
    json.dump(data_list, f, ensure_ascii=False, indent=4)

print("JSON 文件已生成")
<template>
  <view class="video-list-page">
    <!-- 搜索区域 -->
    <view class="search-bar">
      <view class="search-capsule">
        <view class="location-selector" @click="select_location">
          <text class="location-text">{{ displayCity }}</text>
          <u-icon :name="isArrowUp ? 'arrow-up-fill' : 'arrow-down-fill'" size="12" color="#000000"></u-icon>
        </view>
        <view class="divider"></view>
        <view class="search-input-wrapper">
          <u-icon name="search" size="20" color="#A5A5A5"></u-icon>
          <input 
            class="search-input" 
            placeholder="输入表演者/作品介绍" 
            placeholder-style="color: #D3D3D3; font-size: 24rpx;" 
            confirm-type="搜索"
            v-model="params.keyword"
            @input="handleSearchInput"
            @confirm="handleSearchConfirm"
            @keypress="handleKeyPress"
          />
        </view>
      </view>
    </view>
    
    <!-- 内容区域（分类+视频列表） -->
    <view class="content-wrapper">
      <!-- 分类筛选 - 使用u-tabs -->
      <view class="category-tabs-wrapper">
        <view class="uv-tabs-scroll-container">
          <uv-tabs
            v-if="is_tab"
            :list="category_tabs_list"
            :current="current_category_index"
            @click="handle_category_click"
            :activeStyle="{
              color: '#1B9AFF',
              fontWeight: '600'
            }"
            :inactiveStyle="{
              color: '#000'
            }"
            lineColor="#1B9AFF"
            lineWidth="40rpx"
            lineHeight="4"
            :itemStyle="{
              height: '88rpx'
            }"
            :scrollable="true"
          ></uv-tabs>
        </view>
      </view>
      
      <!-- 视频网格 -->
      <scroll-view class="video-grid-container" scroll-y :enable-back-to-top="true" lower-threshold="200" @scrolltolower="loadMoreVideos" :show-scrollbar="false">
        <!-- 加载中 -->
        <view v-if="loading" class="loading-container">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>
        
        <!-- 空状态 -->
        <view v-else-if="!loading && video_list.length === 0" class="empty-container">
          <view class="empty-icon">
            <image 
              :src="imgUrlEvent('/images/wx-applet/home/null-img.png', 'aliyunImgUrl')"
              mode="aspectFill"
              style="width: 276rpx; height: 228rpx;"
            />
          </view>
          <text class="empty-text">暂无数据</text>
        </view>
        
        <!-- 视频列表 -->
        <template v-else>
          <view class="video-grid">
            <view 
              class="video-item" 
              v-for="(item, index) in video_list" 
              :key="item.id"
              @click="play_video(item, index)"
            >
              <view class="video-thumbnail">
                <image 
                  :src="item.cover_image" 
                  mode="aspectFill" 
                  class="thumbnail-image"
                  :lazy-load="true"
                />
                <image
                 @click="toPromotion"
                 :src="imgUrlEvent('/images/wx-applet/home/play-icons.png', 'aliyunImgUrl')"
                 class="play-icon"
                 mode="aspectFill"
               />
              </view>
              <view class="video-info">
                <view class="video-title">{{ item.intro }}</view>
                <view class="video-meta">
                  <text class="meta-item">表演者：{{ item.performer }}</text>
                </view>
                <view class="video-meta">
                  <text class="meta-item">赞助方：{{ item.sponsor || '--' }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 加载更多 -->
          <view v-if="loading_more" class="load-more-container">
            <view class="loading-spinner small"></view>
            <text class="loading-text">加载更多...</text>
          </view>
          
          <!-- 没有更多数据 -->
          <view v-if="!has_more && video_list.length > 0" class="no-more-container">
            <text class="no-more-text">没有更多内容了</text>
          </view>
        </template>
      </scroll-view>
    </view>
  </view>
  <Imodal ref="modal_el" @confirm="updateCity" @close="modalClose" confirmText="确认切换" cancelText="取消切换"   :content="'温馨提示'">
    <template v-slot:title> 
      <view class="modal-el-content">
        <view class="modal-el-parent">
          <view class="modal-el-item">检测到您当前在【{{new_city}}】</view>
          <view class="modal-el-item">需要帮您切换城市吗？</view>
        </view>
      </view>
    </template>
  </Imodal>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, watch } from 'vue';
import homeApi from '@/business/api/modules/home';
import { getLocation } from '@/infrastructure/utils/util';
import { imgUrlEvent } from "@/infrastructure/utils/imgUrls";
import Imodal from "@/views/components/i-modal.vue";
// 位置数据缓存
const locationCache = {};
// 加载状态
const locationLoading = ref(false);
// 省份和城市数据
const allProvinces = ref([]);
const cityMap = ref({});
const emit = defineEmits(['openCityPicker'])
const props = defineProps(['current_tab'])
const is_tab = ref(false)
const modal_el = ref()
// 当前分类索引
const current_category_index = ref(0)

// 分类tabs列表
const category_tabs_list = ref([
  { name: '表演类' },
  { name: '歌唱类' },
  { name: '语言类' }
])
// 视频列表请求参数
const params = ref({
  category_id: 0,
  page: 1,
  pageSize: 10,
  city_code: '1101',
  keyword: '',
})
// 选中的省份和城市 - 默认设置为北京市北京市
const selected_province = ref('北京市')
const selected_city = ref('北京市')
const selected_province_index = ref(0)
const selected_city_index = ref(0)
const new_city = ref('')
const my_targetProvince = ref({})
const my_targetCity = ref({})
// 设置用户当前定位
function setCity(){
  let location_info = uni.getStorageSync("current_city_info");
  if(location_info){
    selected_city.value = location_info.city_name
    params.value.city_code = location_info.city_code
    getVideoList();
  }else{
    getVideoList();
  }

}

// 处理显示的城市名称，去掉结尾的"市"
const displayCity = computed(() => {
  if (selected_city.value && selected_city.value.endsWith('市')) {
    return selected_city.value.slice(0, -1)
  }
  return selected_city.value
})

// picker-view 的值 - 默认设置为北京市北京市
const picker_value = ref([0, 0, 0])

// picker 指示器样式
const indicator_style = ref('height: 128rpx;')

// 加载状态
const loading = ref(false)
const loading_more = ref(false)
const has_more = ref(true)

// 省份列表（从 pca-code.json 获取）
const province_list = ref([])

// 初始化省份列表
async function init_province_list() {
  // 检查缓存
  if (locationCache.provinces) {
    province_list.value = locationCache.provinces;
    allProvinces.value = locationCache.provinces;
    return;
  }

  locationLoading.value = true;
  try {
    const res = await homeApi.getprovinceCityApi();
    if (res && res.data && Array.isArray(res.data.list)) {
      // 转换数据格式
      const provinces = res.data.list.map(item => ({
        name: item.name,
        code: item.code,
        id: item.code, // 使用code作为id
        children: item.children
      }));
      province_list.value = provinces;
      allProvinces.value = provinces;
      // 缓存数据
      locationCache.provinces = provinces;
      // 缓存完整的API响应
      locationCache.fullLocationData = res.data.list;
      
      // 不默认选中北京市，让getUserLocation函数来设置默认值（省级列表的第一项和市级列表的第一项）
    } else {
      console.error('获取省份列表失败:', res);
      province_list.value = [];
    }
  } catch (error) {
    console.error('获取省份列表错误:', error);
    province_list.value = [];
  } finally {
    locationLoading.value = false;
  }
}

watch(() => props.current_tab,() => {
  if(props.current_tab == 1){
    setTimeout(() => {
      is_tab.value = true
    }, 100);
  }
})

// 获取用户当前所在城市
function getUserLocation() {
  // 尝试获取用户真实定位
  getLocation((location) => {
    console.log('获取到的定位信息:', location);
    
    if (location && location.city) {
      let cityName = location.city;
      let provinceName = location.province || '';
      
      // 处理城市名称，去掉结尾的"市"
      if (cityName.endsWith('市')) {
        cityName = cityName.slice(0, -1);
      }
      
      // 处理省份名称，去掉结尾的"省"或"市"
      if (provinceName.endsWith('省') || provinceName.endsWith('市')) {
        provinceName = provinceName.slice(0, -1);
      }
      
      console.log('处理后的城市名称:', cityName);
      console.log('处理后的省份名称:', provinceName);
      
      // 查找对应的省份和城市数据
      if (allProvinces.value.length > 0) {
        // 查找省份
        let targetProvince = allProvinces.value.find(p => {
          const pName = p.name.endsWith('省') || p.name.endsWith('市') ? p.name.slice(0, -1) : p.name;
          return pName === provinceName || p.name === provinceName || provinceName.includes(pName) || pName.includes(provinceName);
        });
        
        // 如果没有找到省份，使用第一个省份
        if (!targetProvince) {
          targetProvince = allProvinces.value[0];
        }
        
        console.log('找到的省份:', targetProvince);
        
        // 查找城市
        if (targetProvince.children) {
          const cities = Object.values(targetProvince.children);
          let targetCity = cities.find(c => {
            const cName = c.name.endsWith('市') ? c.name.slice(0, -1) : c.name;
            return cName === cityName || c.name === cityName || cityName.includes(cName) || cName.includes(cityName);
          });
          
          // 如果没有找到城市，使用第一个城市
          if (!targetCity) {
            targetCity = cities[0];
          }
          console.log('找到的城市:', targetCity);
          if(uni.getStorageSync("current_city_info").city_code != targetCity.code){
            new_city.value = targetCity.name
            modal_el.value.open()
            // 更新位置信息
            my_targetProvince.value = targetProvince
            my_targetCity.value = targetCity
          }
          return;
        }
      }
    }
  });
}

function updateCity(){
  updateLocationInfo(my_targetProvince.value, my_targetCity.value);
  modal_el.value.close()
}

function modalClose(){
  modal_el.value.close()
}

// 更新位置信息
async function updateLocationInfo(province, city) {
  // 更新选中的省份和城市
  selected_province.value = province.name;
  selected_city.value = city.name;
  
  // 直接使用省份在 allProvinces 中的索引
  const provinceIndex = allProvinces.value.findIndex(p => p.name === province.name);
  if (provinceIndex !== -1) {
    selected_province_index.value = provinceIndex;
  } else {
    // 如果找不到，尝试更灵活的匹配
    const flexibleProvinceIndex = allProvinces.value.findIndex(p => 
      p.name === province.name.replace('省', '') ||
      p.name.replace('省', '') === province.name ||
      p.name.includes(province.name) ||
      province.name.includes(p.name)
    );
    if (flexibleProvinceIndex !== -1) {
      selected_province_index.value = flexibleProvinceIndex;
    }
  }
  
  // 初始化城市列表
  await init_city_list();
  
  // 更新picker_value，确保与选中值同步
  picker_value.value = [selected_province_index.value, 0, selected_city_index.value];
  
  // 更新城市代码
  params.value.city_code = city.code || city.id.toString(); // 使用接口返回的 code，fallback 到 id
  
 // 缓存当前城市信息
 uni.setStorageSync("current_city_info", {city_code:city.code,city_name:city.name});

  // 获取视频列表，使用当前的 category_id（默认是分类列表的第一项 id）
  getVideoList();
}

// 城市列表（模拟数据）
const city_list = ref([
  { name: '北京市', code: '110100' },
  { name: '东城区', code: '110101' },
  { name: '西城区', code: '110102' },
  { name: '朝阳区', code: '110105' },
  { name: '丰台区', code: '110106' },
  { name: '石景山区', code: '110107' },
  { name: '海淀区', code: '110108' },
  { name: '门头沟区', code: '110109' },
  { name: '房山区', code: '110111' },
  { name: '通州区', code: '110112' }
])

// 初始化城市列表（根据选中的省份）
async function init_city_list() {
  const provinceName = selected_province.value
  const cityName = selected_city.value
  
  console.log('初始化城市列表，省份:', provinceName, '城市:', cityName);
  
  // 查找选中省份的 id - 使用多种匹配方式
  let selectedProvince = null;
  for (const item of allProvinces.value) {
    if (item.name === provinceName || 
        item.name === provinceName.replace('省', '') ||
        item.name.replace('省', '') === provinceName ||
        item.name.includes(provinceName) ||
        provinceName.includes(item.name)) {
      selectedProvince = item;
      break;
    }
  }
  
  if (!selectedProvince) {
    console.error('未找到选中的省份:', provinceName);
    city_list.value = [
      { name: '市辖区', code: '000100' }
    ];
    selected_city_index.value = 0;
    return;
  }

  const provinceId = selectedProvince.id;
  
  // 检查缓存
  if (cityMap.value[provinceId]) {
    city_list.value = cityMap.value[provinceId];
    // 根据当前选中的城市名称设置正确的索引
    let cityIndex = city_list.value.findIndex(city => 
      city.name === cityName || 
      city.name === cityName + '市' ||
      city.name === cityName.replace('市', '') ||
      city.name.replace('市', '') === cityName ||
      city.name.includes(cityName) ||
      cityName.includes(city.name)
    );
    
    // 特殊处理：如果是北京市，默认选中北京市
    if (provinceName === '北京市' && cityIndex === -1) {
      cityIndex = city_list.value.findIndex(city => 
        city.name === '北京市' || city.name === '北京'
      );
    }
    
    selected_city_index.value = cityIndex !== -1 ? cityIndex : 0;
    console.log('从缓存加载城市列表，城市索引:', selected_city_index.value);
    return;
  }

  try {
    // 从省份的children字段获取城市数据
    if (selectedProvince.children) {
      // 将children对象转换为数组
      const cities = Object.values(selectedProvince.children).map(item => ({
        name: item.name,
        code: item.code,
        id: item.code // 使用code作为id
      }));
      city_list.value = cities;
      // 缓存数据
      cityMap.value[provinceId] = cities;
      // 根据当前选中的城市名称设置正确的索引
      let cityIndex = cities.findIndex(city => 
        city.name === cityName || 
        city.name === cityName + '市' ||
        city.name === cityName.replace('市', '') ||
        city.name.replace('市', '') === cityName ||
        city.name.includes(cityName) ||
        cityName.includes(city.name)
      );
      
      // 特殊处理：如果是北京市，默认选中北京市
      if (provinceName === '北京市' && cityIndex === -1) {
        cityIndex = cities.findIndex(city => 
          city.name === '北京市' || city.name === '北京'
        );
      }
      
      selected_city_index.value = cityIndex !== -1 ? cityIndex : 0;
      console.log('从API加载城市列表，城市索引:', selected_city_index.value);
    } else {
      console.error('该省份没有城市数据:', provinceName);
      city_list.value = [
        { name: '市辖区', code: '000100' }
      ];
      selected_city_index.value = 0;
    }
  } catch (error) {
    console.error('获取城市列表错误:', error);
    city_list.value = [
      { name: '市辖区', code: '000100' }
    ];
    selected_city_index.value = 0;
  }
}

// 设置默认选中城市
function setDefaultCity(provinceName) {
  if (provinceName === '江西省' || provinceName === '江西') {
    // 江西省默认选中赣州
    const ganzhou_index = city_list.value.findIndex(city => city.name === '赣州市' || city.name === '赣州');
    if (ganzhou_index !== -1) {
      selected_city_index.value = ganzhou_index;
    } else {
      selected_city_index.value = 0;
    }
  } else if (provinceName === '北京市' || provinceName === '北京') {
    // 北京市默认选中北京市
    const beijing_index = city_list.value.findIndex(city => city.name === '北京市' || city.name === '北京');
    if (beijing_index !== -1) {
      selected_city_index.value = beijing_index;
    } else {
      selected_city_index.value = 0;
    }
  } else {
    // 其他省份默认选中第一个城市
    selected_city_index.value = 0;
  }
}

// 视频列表数据
const video_list = ref([])

// 箭头图标方向状态（默认下箭头）
const isArrowUp = ref(false)

// 获取分类列表
async function getCategoryList() {
  try {
    const res = await homeApi.getStageCategoryApi({})
    console.log('分类列表数据:', res)
    
    // 灵活检查响应是否成功
    let isSuccess = false
    let categoryData = []
    
    // 检查多种可能的成功状态（根据拦截器逻辑，只有code=200才会成功返回）
    if (res && (res.code === 200 || res.success === true || res.status === 'success' || res.code === 0 || res.code === 1)) {
      // 检查多种可能的数据字段
      if (Array.isArray(res.data)) {
        categoryData = res.data
        isSuccess = true
      } else if (Array.isArray(res.result)) {
        categoryData = res.result
        isSuccess = true
      } else if (Array.isArray(res.list)) {
        categoryData = res.list
        isSuccess = true
      } else if (Array.isArray(res)) {
        // 如果直接返回数组
        categoryData = res
        isSuccess = true
      }
    }
    
    // 如果响应成功且有数据
    if (isSuccess && categoryData.length > 0) {
      // 检查数据结构，确保每个分类都有 id 字段
      category_tabs_list.value = categoryData.map((item, index) => ({
        name: item.name || item.title || `分类${index + 1}`,
        id: item.id || item.category_id || item.cat_id || item.categoryId || index + 1
      }))
      console.log('处理后的分类列表:', category_tabs_list.value)
      
      // 默认使用分类列表的第一项 id
      if (category_tabs_list.value.length > 0) {
        params.value.category_id = category_tabs_list.value[0].id
        console.log('默认分类 id:', params.value.category_id)
      }
    } else {
      console.log('分类列表响应不符合预期:', res)
      // 如果没有获取到分类数据，使用默认分类
      category_tabs_list.value = [
        { name: '表演类', id: 1 },
        { name: '歌唱类', id: 2 },
        { name: '语言类', id: 3 }
      ]
      
      // 默认使用默认分类列表的第一项 id
      params.value.category_id = category_tabs_list.value[0].id
      console.log('默认分类 id:', params.value.category_id)
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    // 如果 API 调用失败，使用默认分类
    category_tabs_list.value = [
      { name: '表演类', id: 1 },
      { name: '歌唱类', id: 2 },
      { name: '语言类', id: 3 }
    ]
    
    // 默认使用默认分类列表的第一项 id
    params.value.category_id = category_tabs_list.value[0].id
    console.log('默认分类 id:', params.value.category_id)
  }
}

// 获取视频列表
async function getVideoList(isLoadMore = false) {
  if ((isLoadMore && !has_more.value) || loading.value || loading_more.value) {
    return
  }

  if (!isLoadMore) {
    loading.value = true
    params.value.page = 1
    video_list.value = []
    has_more.value = true
  } else {
    loading_more.value = true
  }

  try {
    console.log('请求视频列表参数:', params.value)
    const res = await homeApi.getStageListApi(params.value)
    console.log('视频列表响应:', res)
    
    // 直接赋值接口数据
    if (res && res.data && Array.isArray(res.data.items)) {
      if (isLoadMore) {
        video_list.value = [...video_list.value, ...res.data.items]
      } else {
        video_list.value = res.data.items
      }
      // 使用 pageInfo 控制滚动下拉
      if (res.data.pageInfo) {
        has_more.value = res.data.pageInfo.currentPage < res.data.pageInfo.totalPage
      }
      params.value.page++
    }
  } catch (error) {
    console.error('获取视频列表失败:', error)
  } finally {
    loading.value = false
    loading_more.value = false
  }
}

// 处理分类点击
function handle_category_click(item: any, index: number) {
  console.log('分类点击:', item, index)
  current_category_index.value = index
  params.value.category_id = item.id || item.category_id || item.cat_id || 0
  console.log('分类 id 赋值:', params.value.category_id)
  getVideoList()
}

// 处理搜索输入
function handleSearchInput() {
  // 输入时可以选择是否自动搜索
  // 这里暂时不自动搜索，等待用户点击搜索按钮
}

// 处理键盘按下事件
function handleKeyPress(event: any) {
  // 阻止回车键的默认行为（换行）
  if (event.keyCode === 13 || event.key === 'Enter') {
    event.preventDefault();
    // 执行搜索
    handleSearchConfirm();
  }
}

// 处理搜索确认
function handleSearchConfirm() {
  // 点击搜索按钮或键盘回车时执行搜索
  getVideoList()
}

// 选择地区
async function select_location() {
  // 确保省份数据已加载
  if (allProvinces.value.length === 0) {
    await init_province_list();
  }
  
  // 初始化城市列表 - 使用当前选中的省份
  await init_city_list();
  
  console.log('打开城市选择器，当前选中:', {
    province: selected_province.value,
    city: selected_city.value,
    provinceIndex: selected_province_index.value,
    cityIndex: selected_city_index.value
  });
  
  // 使用当前的选中值，保持用户之前的选择
  picker_value.value = [selected_province_index.value, 0, selected_city_index.value];
  
  // 设置箭头向上
  isArrowUp.value = true;
  
  // 通知父组件打开城市选择弹窗
  emit('openCityPicker', {
    province_list: allProvinces.value,
    city_list: city_list.value,
    picker_value: picker_value.value,
    selected_province_index: selected_province_index.value,
    selected_city_index: selected_city_index.value
  });
}

// 加载更多视频
function loadMoreVideos() {
  if (has_more.value && !loading.value && !loading_more.value) {
    getVideoList(true)
  }
}

// 搜索功能已集成到搜索输入框中，此函数不再使用

function play_video(item: any, index: number) {
  // 跳转到视频详情页
  // @ts-ignore
  try{
  uni.navigateTo({
    url: `/pagesVideo/video-detail?id=${item.id}`
  })
  }catch(error){
  }

}

// 更新选中的城市（由父组件调用）
function updateSelectedCity(cityName: string, provinceName: string, provinceIndex: number, cityIndex: number, cityCode?: string) {
  selected_city.value = cityName
  selected_province.value = provinceName
  selected_province_index.value = provinceIndex
  selected_city_index.value = cityIndex
  
  // 更新 city_code 参数
  if (cityCode) {
    params.value.city_code = cityCode
  } else {
    // 如果没有传入 cityCode，则从 city_list 中获取
    const city = city_list.value[cityIndex]
    if (city && city.code) {
      params.value.city_code = city.code
    }
  }
  
  // 记录用户选择的城市到历史记录
  const historyCities = uni.getStorageSync("historyCities") || [];
  // 移除已存在的相同城市
  const filteredHistory = historyCities.filter((city: string) => city !== cityName);
  // 将新选择的城市添加到历史记录的开头
  const newHistory = [cityName, ...filteredHistory].slice(0, 5); // 只保留最近5个选择
  uni.setStorageSync("historyCities", newHistory);
  
  // 城市选择完成，设置箭头向下
  isArrowUp.value = false;

  // 缓存当前城市
  
  uni.setStorageSync("current_city_info", {city_code:cityCode,city_name:cityName});
  // 根据选择的城市刷新视频列表
  getVideoList()
}

// 更新箭头方向
function updateArrowDirection(isUp: boolean) {
  isArrowUp.value = isUp
}

// 暴露方法给父组件
defineExpose({
  updateSelectedCity,
  updateArrowDirection
})

onMounted(() => {
  // 获取分类列表，然后获取视频列表
  async function initData() {
    await getCategoryList();
    // 初始化省份列表
    await init_province_list();
    // 初始化城市列表
    await init_city_list();
    // 使用默认定位
    setCity()
    // 获取用户当前所在城市
    getUserLocation();
    
  }
  initData();
})

defineOptions({
  options: {
    styleIsolation: 'shared' // 允许样式穿透（微信小程序）
  }
})
</script>

<style lang="less" scoped>
.modal-el-content{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
  .modal-el-parent{
    
  }
}
:deep(.m_btns){
  margin-top: 60rpx;
}

.video-list-page {
  width: 100%;
  height: 100%;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.search-bar {
  padding: 20rpx 30rpx 40rpx;
  background: #FFFFFF;
  position: relative;
  z-index: 1;
}

.search-capsule {
  display: flex;
  align-items: center;
  background: transparent;
  border: 1rpx solid #979797;
  border-radius: 36rpx;
  height: 72rpx;
  padding: 0 24rpx;
  gap: 16rpx;
}

.location-selector {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
  
  .location-text {
    font-size: 28rpx;
    margin-right: 16rpx;
    color: #000000;
  }
}

.divider {
  width: 1rpx;
  height: 28rpx;
  background: #E5E5E5;
  flex-shrink: 0;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  
  .search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    background: transparent;
  }
}

/* 内容区域整体 */
.content-wrapper {
  flex: 1;
  background: #F9F9F9;
  border-radius: 28rpx 28rpx 0 0;
  margin-top: -20rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* 分类tabs区域 - uv-tabs组件 */
.category-tabs-wrapper {
  background: #F9F9F9;
  padding-left: 30rpx;
  overflow: hidden;
}

/* uv-tabs滚动容器 - 用于隐藏滚动条 */
.uv-tabs-scroll-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  /* 隐藏滚动条 - 小程序兼容方案 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  /* 安卓平台滚动条隐藏技巧 */
  padding-right: 10rpx;
  margin-right: -10rpx;
}

/* 隐藏WebKit滚动条 */
.uv-tabs-scroll-container::-webkit-scrollbar {
  display: none;
}

/* 确保uv-tabs内容充满容器 */
.uv-tabs-scroll-container > view {
  width: auto;
  min-width: 100%;
}

.uv-tabs-scroll-container ::v-deep .uv-tabs{
   &::-webkit-scrollbar {
    display: none;
  }
} 

.video-grid-container {
  flex: 1;
  height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #F9F9F9;
  /* 隐藏滚动条 - 针对所有平台 */
  /* 针对WebKit内核（如Chrome、Safari、安卓WebView） */
  &::-webkit-scrollbar {
    display: none;
  }
  /* 针对Firefox */
  scrollbar-width: none;
  /* 针对IE和Edge */
  -ms-overflow-style: none;
  /* 针对安卓平台的额外优化 */
  padding-right: 1px;
  margin-right: -1px;
  overflow-x: hidden;
}

.video-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 24rpx;
  gap: 16rpx;
}

.video-item {
  width: calc((100% - 16rpx) / 2);
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 16rpx;
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 240rpx;
  background: #fff;
  overflow: hidden;
  padding: 8rpx;
  .thumbnail-image {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 16rpx;
  }
  
  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60rpx;
    height: 60rpx;
  }
}

.video-info {
  padding: 20rpx 16rpx;
}

.video-title {
  font-size: 30rpx;
  line-height: 40rpx;
  max-height: 80rpx;
  color: #000;
  font-weight: 500;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  white-space: normal;
  vertical-align: bottom;
}

.video-meta {
  margin-bottom: 8rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .meta-item {
    font-size: 24rpx;
    color: #A5A5A5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    vertical-align: bottom;
  }
}

/* 加载状态 */
.loading-container {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20rpx;
  
  .loading-text {
    font-size: 28rpx;
    color: #666666;
  }
}

/* 加载 spinner */
.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #1B9AFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  &.small {
    width: 40rpx;
    height: 40rpx;
    border-width: 3rpx;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24rpx;
  
  .empty-icon {
    font-size: 64rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999999;
  }
}

/* 加载更多 */
.load-more-container {
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  
  .loading-text {
    font-size: 24rpx;
    color: #666666;
  }
}

/* 没有更多数据 */
.no-more-container {
  padding: 40rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .no-more-text {
    font-size: 24rpx;
    color: #999999;
  }
}

/* #ifdef MP-WEIXIN */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
::-webkit-scrollbar {
  display: none;
}
/* #endif */

</style>
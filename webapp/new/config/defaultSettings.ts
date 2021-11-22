/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-08-07 09:58:37
 * @LastEditors: Adxiong
 * @LastEditTime: 2021-11-22 11:02:16
 */
import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '诸葛编译平台',
  pwa: false,
  iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;

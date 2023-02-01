// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Quản lý tài khoản',
    path: '/admin/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Quản lý kho',
    path: '/admin/store',
    icon: icon('ic_building'),
  },
  {
    title: 'Dòng sản phẩm',
    path: '/admin/productline',
    icon: icon('ic_product'),
  },
  
];

export default navConfig;

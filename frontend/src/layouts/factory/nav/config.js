// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/factory/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Nhập sản phẩm',
    path: '/factory/user',
    icon: icon('ic_import'),
  },
  {
    title: 'Xuất sản phẩm',
    path: '/factory/export',
    icon: icon('ic_export'),
  },
  {
    title: 'Vận chuyển',
    path: '/factory/transport',
    icon: icon('ic_transport'),
  },
  {
    title: 'Sản phẩm lỗi',
    path: '/factory/error',
    icon: icon('ic_error'),
  }
];

export default navConfig;

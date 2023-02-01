// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/guarantee/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Tiếp nhận sản phẩm',
    path: '/guarantee/receive',
    icon: icon('ic_import'),
  },
  {
    title: 'Đang bảo hành',
    path: '/guarantee/insurancing',
    icon: icon('ic_insurance'),
  },
  
];

export default navConfig;

// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/agency/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Quản lý sản phẩm',
    path: '/agency/product',
    icon: icon('ic_product'),
  },
  {
    title: 'Bán sản phẩm',
    path: '/agency/sell',
    icon: icon('ic_sell'),
  },
  {
    title: 'Nhập sản phẩm',
    path: '/agency/import',
    icon: icon('ic_import'),
  }, {
    title: 'Quản lý đơn hàng',
    path: '/agency/bill',
    icon: icon('ic_bill'),
  },
  {
    title: 'Sản phẩm của khách',
    path: '/agency/product-customers',
    icon: icon('ic_error'),
  },
  {
    title: 'Sản phẩm cần bảo hành',
    path: '/agency/product-insurance',
    icon: icon('ic_insurance'),
  },
];

export default navConfig;

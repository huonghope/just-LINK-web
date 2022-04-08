const privateRoutes = [
  {
    path: '/meeting/open',
    exact: false,
    loader: () => import('../pages/MeetingRoom/MeetingRoom'),
    menu: false,
    label: '강좌 미팅',
    permissionRequired: null,
    icon: 'home',
  },
  {
    path: '/meeting',
    exact: false,
    loader: () => import('../pages/LandingPage'),
    menu: false,
    label: '강좌 미팅',
    permissionRequired: null,
    icon: 'home',
  },
];
const publicRoutes = [
  {
    path: '/',
    exact: true,
    loader: () => import('../pages/ConfirmRedirect'),
  },
];

const authRoutes = [];

const errorRoutes = [
  // 해당 리소스에 유효한 인증 자격 증명 오류
  {
    path: '/401',
    exact: true,
    loader: () => import('../components/Error/Error401Page'),
  },
  // 권한
  {
    path: '/403',
    exact: true,
    loader: () => import('../components/Error/Error403Page'),
  },
  {
    path: '/404',
    exact: true,
    loader: () => import('../components/Error/Error404Page'),
  },
  {
    path: '/500',
    exact: true,
    loader: () => import('../components/Error/Error500Page'),
  },
];

export default {
  privateRoutes,
  publicRoutes,
  authRoutes,
  errorRoutes,
};

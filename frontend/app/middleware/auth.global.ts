export default defineNuxtRouteMiddleware((to) => {
  const { getAccessToken } = useToken();
  const token = getAccessToken();

  if (!token && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (token && to.path === '/login') {
    return navigateTo('/');
  }
});

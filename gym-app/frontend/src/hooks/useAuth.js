export default function useAuth() {
  const access = localStorage.getItem("access");
  return !!access;
}
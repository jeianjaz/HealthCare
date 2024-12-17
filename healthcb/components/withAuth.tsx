"use client";
import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const withAdminAuth = <P extends object>(WrappedComponent: ComponentType<P>, redirectIfAuthenticated: boolean = false) => {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshAccessToken = async (refreshToken: string) => {
      try {
        const response = await fetch(`/api/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }

        const data = await response.json();
        localStorage.setItem("accessToken", data.access);
        return data.access;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
      }
    };

    const verifyToken = async (token: string) => {
      try {
        const response = await fetch(`/api/token/verify/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
              return await verifyToken(newAccessToken);
            }
          }
          localStorage.removeItem("accessToken");
        }

        return true;
      } catch (error) {
        console.error("Error verifying token:", error);
        return false;
      }
    };

    useEffect(() => {
      const checkAuth = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const isValid = accessToken && await verifyToken(accessToken);

        if (!isValid) {
          if (redirectIfAuthenticated) {
            setIsAuthenticated(false);
          } else {
            const error = encodeURIComponent('Session expired. Please login again.');
            router.push(`/login?error=${error}`);
          }
        } else {
          if (redirectIfAuthenticated) {
            router.push("/admin");
          } else {
            setIsAuthenticated(true);
          }
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [router, redirectIfAuthenticated]);

    if (isLoading) {
      return <Loading />;
    }

    if (!isLoading && !isAuthenticated && !redirectIfAuthenticated) {
      return <Loading />;  // Show loading while redirecting to login
    }

    if (!isLoading && isAuthenticated && redirectIfAuthenticated) {
      return <Loading />;  // Show loading while redirecting to admin
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
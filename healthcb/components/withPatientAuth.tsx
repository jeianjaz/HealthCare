
"use client";
import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import checkSession from "@/utils/session_check";

const withPatientAuth = <P extends object>(
  WrappedComponent: ComponentType<P>, 
  redirectIfAuthenticated: boolean = false
) => {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    const checkAuth = async () => {
      try {
        const data = await checkSession();
        if (redirectIfAuthenticated) {
          router.push("/patient/");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        if (redirectIfAuthenticated) {
          setIsLoading(false);
        } else {
          setSessionExpired(true);
          setIsLoading(false);
          router.push("/patient/login");
        }
      }
    };

    useEffect(() => {
      checkAuth();
    }, []);

    if (isLoading) return <Loading />;
    if (sessionExpired) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withPatientAuth;
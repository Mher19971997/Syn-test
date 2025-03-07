import Loading from "@/components/loading/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ComponentType, JSX } from "react";

function withoutAuth<P>(WrappedComponent: ComponentType<P>): ComponentType<P> {
  const NonAuthComponent = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (session) {
        router.replace("/dashboard");
      }
    }, [session, router]);

    if (status === "loading") {
      return null;
    }

    if (session) {
      return <Loading />;
    }

    return <WrappedComponent {...(props as P & JSX.IntrinsicAttributes)} />;
  };

  return NonAuthComponent;
}

export default withoutAuth;

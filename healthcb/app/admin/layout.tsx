"use client";

import withAuth from "@/components/withAuth";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <>{children}</>;
};

const AuthenticatedAdminLayout = withAuth(AdminLayout);
export default AuthenticatedAdminLayout;
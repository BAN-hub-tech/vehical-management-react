import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { AppLayout } from "@/shared/types/common";
import { LoginPage } from "@/features/auth";
import { CardFormPage, CardListPage, LostCardFormPage, LostCardListPage } from "@/features/cards";
import {
  RegistrationFeeFormPage,
  RegistrationFeePage,
  TicketFormPage,
  TicketListPage,
  VehicleFormPage,
  VehicleListPage,
  VisitorFeeFormPage,
  VisitorParkingFeePage,
} from "@/features/catalog";
import { ContactPage, CustomerHistoryPage, PricingPage, ProfilePage } from "@/features/customer-portal";
import { CustomerFormPage, CustomerListPage } from "@/features/customers";
import { DashboardPage } from "@/features/dashboard";
import { AccountFormPage, AccountListPage, InternalProfilePage, RoleFormPage, RoleListPage } from "@/features/iam";
import { SwipeEntryPage, SwipeListPage } from "@/features/parking";

export interface RouteDefinition {
  path: string;
  title: string;
  layout: AppLayout;
  element: ReactNode;
}

export const routes: RouteDefinition[] = [
  { path: "/admin/dashboard", title: "Trang chu", layout: "admin", element: <DashboardPage /> },
  { path: "/admin/swipe", title: "Quan ly vao ra", layout: "admin", element: <SwipeListPage /> },
  { path: "/admin/swipe/swipein", title: "Xe vao", layout: "admin", element: <SwipeEntryPage mode="in" /> },
  { path: "/admin/swipe/swipeout", title: "Xe ra", layout: "admin", element: <SwipeEntryPage mode="out" /> },
  { path: "/admin/card", title: "Quan ly the", layout: "admin", element: <CardListPage /> },
  { path: "/admin/card/form", title: "Thong tin the", layout: "admin", element: <CardFormPage /> },
  { path: "/admin/lost", title: "The bi mat", layout: "admin", element: <LostCardListPage /> },
  { path: "/admin/lost/form", title: "Thong tin the bi mat", layout: "admin", element: <LostCardFormPage /> },
  { path: "/admin/ticket", title: "Quan ly ve", layout: "admin", element: <TicketListPage /> },
  { path: "/admin/ticket/form", title: "Thong tin ve", layout: "admin", element: <TicketFormPage /> },
  { path: "/admin/vehicle", title: "Quan ly phuong tien", layout: "admin", element: <VehicleListPage /> },
  { path: "/admin/vehicle/form", title: "Thong tin phuong tien", layout: "admin", element: <VehicleFormPage /> },
  { path: "/admin/visitorParkingFee", title: "Phi vang lai", layout: "admin", element: <VisitorParkingFeePage /> },
  { path: "/admin/visitorParkingFee/form", title: "Thong tin phi vang lai", layout: "admin", element: <VisitorFeeFormPage /> },
  { path: "/admin/parkingFeeOfCustomer", title: "Phi dang ky", layout: "admin", element: <RegistrationFeePage /> },
  { path: "/admin/parkingFeeOfCustomer/form", title: "Thong tin phi dang ky", layout: "admin", element: <RegistrationFeeFormPage /> },
  { path: "/admin/account", title: "Quan ly tai khoan", layout: "admin", element: <AccountListPage /> },
  { path: "/admin/account/form", title: "Thong tin tai khoan", layout: "admin", element: <AccountFormPage /> },
  { path: "/admin/profile", title: "Thong tin tai khoan ca nhan", layout: "admin", element: <InternalProfilePage /> },
  { path: "/admin/customer", title: "Quan ly khach hang", layout: "admin", element: <CustomerListPage /> },
  { path: "/admin/customer/form", title: "Thong tin khach hang", layout: "admin", element: <CustomerFormPage /> },
  { path: "/admin/role", title: "Phan quyen vai tro", layout: "admin", element: <RoleListPage /> },
  { path: "/admin/role/form", title: "Thong tin vai tro", layout: "admin", element: <RoleFormPage /> },
  { path: "/pricing", title: "Bang gia dich vu do xe", layout: "client", element: <PricingPage /> },
  { path: "/customerTicket/customer-infor", title: "Thong tin khach hang", layout: "client", element: <CustomerHistoryPage /> },
  { path: "/customerTicket/customer-infor-detail", title: "Thong tin tai khoan", layout: "client", element: <ProfilePage /> },
  { path: "/contact", title: "Lien he", layout: "client", element: <ContactPage /> },
  { path: "/login", title: "Dang nhap", layout: "auth", element: <LoginPage mode="login" /> },
  { path: "/register", title: "Dang ky", layout: "auth", element: <LoginPage mode="register" /> },
  { path: "/forgot-password", title: "Quen mat khau", layout: "auth", element: <LoginPage mode="forgot" /> },
  { path: "/forgot-password/otp", title: "OTP", layout: "auth", element: <Navigate to="/forgot-password" replace /> },
  { path: "/recover-password", title: "Recover", layout: "auth", element: <Navigate to="/forgot-password" replace /> },
];

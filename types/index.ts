import { ReactNode } from "react";

export type TimelineSize = "sm" | "md" | "lg";
export type TimelineStatus = "completed" | "in-progress" | "pending";
export type TimelineColor =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "destructive";

export interface TimelineElement {
  id: number;
  date: string;
  title: string;
  description: string;
  icon?: ReactNode | (() => ReactNode);
  status?: TimelineStatus;
  color?: TimelineColor;
  size?: TimelineSize;
  loading?: boolean;
  error?: string;
}

export interface TimelineProps {
  items: TimelineElement[];
  size?: TimelineSize;
  animate?: boolean;
  iconColor?: TimelineColor;
  connectorColor?: TimelineColor;
  className?: string;
}

export interface Project {
  endpoint_url: string;
  endpoint_token: string;
  config_yaml: string;
}

export interface ProjectUsage {
  id: string;
  user_id: string;
  can_use_tokens: number;
  can_use_conversations: number;
  used_tokens_by_month: number;
  used_tokens_by_day: {
    x: string;
    left: number;
    right: number;
  }[];
  insert_requests_by_day: {
    x: string;
    left: number;
    right: number;
  }[];
}

export interface User {
  id: string;
  project_id: string;
  profile_count: number;
  event_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectUsers {
  users: User[];
  count: number;
}

export const PROJECT_USERS_ORDER_FIELDS = ["updated_at", "profile_count", "event_count"] as const;
export type ProjectUsersOrderBy = typeof PROJECT_USERS_ORDER_FIELDS[number] | (string & {});

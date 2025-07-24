"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserMemory } from "@/components/user-memory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { JsonDownload } from "@/components/json-download";

import { UserProfile, UserEvent, ProjectUser } from "@memobase/memobase";
import { ProjectUsersOrderBy } from "@/types";
import { deleteUserByUid, getProjectUserMemories } from "@/api/models/memobase";
import { getProjectUsers } from "@/api/models/memobase";

import { ArrowDown01, ArrowDown10, ArrowDownUp } from "lucide-react";

import { toast } from "sonner";

import { Project } from "@/types";

export default function Users({ project }: { project: Project }) {
  const t = useTranslations("project.users");
  const router = useRouter();
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [orderBy, setOrderBy] = useState<ProjectUsersOrderBy>("updated_at");
  const [orderDesc, setOrderDesc] = useState(true);
  const [limit] = useState(10);
  const [page, setPage] = useState(1);

  const [memoriesLoading, setMemoriesLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [memoriesUserId, setMemoriesUserId] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null);

  const handleDelete = async (uid: string) => {
    setLoading(true);
    try {
      const res = await deleteUserByUid(uid);
      if (res.code === 0) {
        toast.success(t("deleteSuccess"));
        await fetchUsers();
      } else {
        toast.error(res.message || t("deleteFailed"));
      }
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setLoading(false);
      setSelectedUser(null);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getProjectUsers(
        "",
        debouncedSearch,
        orderBy,
        orderDesc,
        limit,
        limit * (page - 1)
      );
      if (res.code === 401) {
        router.push("/login");
      }
      if (res.code === 0 && res.data) {
        setUsers(res.data.users);
        setCount(res.data.count);
      } else {
        toast.error(res.message || t("getUsersFailed"));
      }
    } catch {
      toast.error(t("getUsersFailed"));
    }
  }, [limit, orderBy, orderDesc, page, router, debouncedSearch, t]);

  const fetchMemories = async (uid: string) => {
    setMemoriesLoading(true);
    try {
      const res = await getProjectUserMemories(uid);
      if (res.code === 401) {
        router.push("/login");
      }
      if (res.code === 0 && res.data) {
        setProfiles(res.data.profiles);
        setEvents(res.data.events);
        return {
          profiles: res.data.profiles,
          events: res.data.events,
        };
      } else {
        toast.error(res.message || t("getMemoriesFailed"));
      }
    } catch {
      toast.error(t("getMemoriesFailed"));
    } finally {
      setMemoriesLoading(false);
    }
  };

  useEffect(() => {
    if (!project) return;
    setLoading(true);
    fetchUsers().finally(() => {
      setLoading(false);
    });
  }, [fetchUsers, project]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetHeader className="hidden">
          <SheetTitle>Assistant</SheetTitle>
          <SheetDescription>Assistant</SheetDescription>
        </SheetHeader>

        <SheetContent side="right" className="p-0">
          <UserMemory
            isLoading={memoriesLoading}
            setIsLoading={setMemoriesLoading}
            profiles={profiles}
            events={events}
            profilesFold
            canDownload={
              !memoriesLoading && (!!profiles.length || !!events.length)
            }
            downloadFileName={`memobase-${memoriesUserId}.json`}
          />
        </SheetContent>
      </Sheet>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex w-full max-w-xl items-center space-x-2">
            <Input
              value={search}
              placeholder={t("placeholder")}
              onChange={(e) => setSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                }
              }}
            />
            <Button
              type="submit"
              onClick={() => {
                setPage(1);
              }}
            >
              {t("search")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setOrderBy("updated_at");
                setOrderDesc(true);
                setPage(1);
              }}
            >
              {t("reset")}
            </Button>
          </div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-[60dvh] w-full" />
              <Skeleton className="h-[4dvh] w-1/2 m-auto" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.id")}</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="group/item"
                        onClick={() => {
                          setOrderBy("profile_count");
                          setOrderDesc(!orderDesc);
                          setPage(1);
                        }}
                      >
                        {t("table.profileCount")}
                        {orderBy === "profile_count" ? (
                          <>
                            {orderDesc ? (
                              <ArrowDown10 className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ArrowDown01 className="h-4 w-4 text-muted-foreground" />
                            )}
                          </>
                        ) : (
                          <ArrowDownUp className="h-4 w-4 text-muted-foreground/30 group-hover/item:text-muted-foreground" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="group/item"
                        onClick={() => {
                          setOrderBy("event_count");
                          setOrderDesc(!orderDesc);
                          setPage(1);
                        }}
                      >
                        {t("table.eventCount")}
                        {orderBy === "event_count" ? (
                          <>
                            {orderDesc ? (
                              <ArrowDown10 className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ArrowDown01 className="h-4 w-4 text-muted-foreground" />
                            )}
                          </>
                        ) : (
                          <ArrowDownUp className="h-4 w-4 text-muted-foreground/30 group-hover/item:text-muted-foreground" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>{t("table.createdAt")}</TableHead>
                    <TableHead>{t("table.updatedAt")}</TableHead>
                    <TableHead>{t("table.action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="pl-5">
                        {user.profile_count.toLocaleString()}
                      </TableCell>
                      <TableCell className="pl-5">
                        {user.event_count.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(user.updated_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMemoriesUserId(user.id);
                            setOpen(true);
                            fetchMemories(user.id);
                          }}
                        >
                          {t("table.memories")}
                        </Button>
                        <JsonDownload
                          fileName={`memobase-${user.id}.json`}
                          beforeEvent={async () => {
                            setMemoriesUserId(user.id);
                            return fetchMemories(user.id);
                          }}
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={
                                (!user.profile_count && !user.event_count) ||
                                (memoriesLoading && memoriesUserId === user.id)
                              }
                            >
                              {memoriesLoading && memoriesUserId === user.id
                                ? t("table.downloading")
                                : t("table.download")}
                            </Button>
                          }
                        />
                        <AlertDialog
                          open={selectedUser?.id === user.id}
                          onOpenChange={(open) =>
                            !open && setSelectedUser(null)
                          }
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              {t("delete")}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("deleteConfirmTitle")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("deleteConfirmDescription")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setSelectedUser(null)}
                              >
                                {t("cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id)}
                              >
                                {t("confirm")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink className="w-20 text-sm text-muted-foreground">
                      {t("table.count", { count })}
                    </PaginationLink>
                  </PaginationItem>
                  {page > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            setPage(page - 1);
                          }}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => {
                            setPage(page - 1);
                          }}
                        >
                          {page - 1}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                  </PaginationItem>
                  {page < Math.ceil(count / limit) && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => {
                            setPage(page + 1);
                          }}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            setPage(page + 1);
                          }}
                        />
                      </PaginationItem>
                    </>
                  )}
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

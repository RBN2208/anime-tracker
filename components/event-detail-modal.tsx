"use client";

import { CalendarEvent } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, ExternalLink, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import Link from "next/link";

interface EventDetailModalProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (animeId: string) => void;
  onWatchedChange?: (eventId: string, watched: boolean) => void;
}

export function EventDetailModal({
  event,
  open,
  onOpenChange,
  onDelete,
  onWatchedChange,
}: EventDetailModalProps) {
  if (!event) return null;

  const eventDate = typeof event.date === "string" ? new Date(event.date) : event.date;
  const formattedDate = formatDate(eventDate);

  const transformedLink = event.sourceUrl ? event.sourceUrl.slice(0, -1) + event.episodeNumber : ""

  const handleDelete = () => {
    if (onDelete && event.animeId) {
      onDelete(event.animeId);
      onOpenChange(false);
    }
  };

  const handleWatchedChange = (checked: boolean | 'indeterminate') => {
    if (onWatchedChange && event.id && typeof checked === 'boolean') {
      onWatchedChange(event.id, checked);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Episode Details
          </DialogTitle>
          <DialogDescription>
            Informationen zu diesem Release
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Anime Title */}
          {event.title && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Anime
              </label>
              <p className="text-lg font-semibold">{event.title}</p>
            </div>
          )}

          {/* Episode Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Staffel
              </label>
              <p className="text-2xl font-bold">{event.season}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Episode
              </label>
              <p className="text-2xl font-bold">{event.episodeNumber}</p>
            </div>
          </div>

          {/* Release Date */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Release-Datum
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-base px-3 py-1">
                {formattedDate}
              </Badge>
              {new Date(eventDate) < new Date() && (
                <Badge variant="secondary">Vergangen</Badge>
              )}
              {new Date(eventDate).toDateString() === new Date().toDateString() && (
                <Badge variant="default">Heute</Badge>
              )}
            </div>
          </div>

          {/* Full Episode Identifier */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Episode-ID
            </label>
            <p className="text-lg font-mono">
              S{String(event.season).padStart(2, "0")}E
              {String(event.episodeNumber).padStart(2, "0")}
            </p>
          </div>

          {/* Watched Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="watched"
              defaultChecked={event.watched || false}
              onCheckedChange={handleWatchedChange}
            />
            <Label
              htmlFor="watched"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Als angesehen markieren
            </Label>
          </div>
        </div>

        <DialogFooter className="flex-row flex-wrap sm:flex-row gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Anime löschen
          </Button>
          <div className="flex-1" />
          {event.sourceUrl && (
            <Button
              asChild
              className="w-full sm:w-auto"
            >
              <Link href={transformedLink} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Quelle öffnen
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

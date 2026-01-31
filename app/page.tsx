'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/calendar';
import { AddAnimeModal } from '@/components/add-anime-modal';
import { EventDetailModal } from '@/components/event-detail-modal';
import { Toaster } from '@/components/ui/toaster';
import { Anime, CalendarEvent } from '@/types';
import { getAnimes, saveAllAnimes, updateAnime, deleteAnime, initializeStorage, getWatchedEvents, setEventWatched } from '@/lib/storage';
import { getAllEvents } from '@/lib/event-generator';
import { generateId } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [watchedEvents, setWatchedEvents] = useState<Record<string, boolean>>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load animes on mount
  useEffect(() => {
    setIsLoading(true);
    initializeStorage();
    setAnimes(getAnimes());
    setWatchedEvents(getWatchedEvents());
    setIsLoading(false);
  }, []);

  // Auto-save animes when they change
  useEffect(() => {
    // Skip initial render to avoid overwriting on load
    if (animes.length === 0) return;
    
    try {
      saveAllAnimes(animes);
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: 'Speicherfehler',
        description: 'Daten konnten nicht gespeichert werden',
        variant: 'destructive',
      });
    }
  }, [animes, toast]);

  // Generate events from animes (memoized for performance)
  const events = useMemo<CalendarEvent[]>(() => {
    if (animes.length === 0) {
      return [];
    }
    const generatedEvents = getAllEvents(animes);
    // Add watched status to events
    return generatedEvents.map(event => ({
      ...event,
      watched: watchedEvents[event.id] || false
    }));
  }, [animes, watchedEvents]);

  const handleAddAnime = (animeData: Omit<Anime, 'id' | 'createdAt'>) => {
    const newAnime: Anime = {
      ...animeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setAnimes([...animes, newAnime]);
  };

  const handleUpdateAnime = (id: string, updates: Partial<Anime>) => {
    try {
      setAnimes(prev =>
        prev.map(anime =>
          anime.id === id ? { ...anime, ...updates } : anime
        )
      );
      toast({
        title: 'Erfolgreich aktualisiert',
        description: 'Anime wurde erfolgreich aktualisiert',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Anime konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAnime = (id: string) => {
    try {
      setAnimes(prev => prev.filter(anime => anime.id !== id));
      toast({
        title: 'Erfolgreich gelöscht',
        description: 'Anime wurde erfolgreich gelöscht',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Anime konnte nicht gelöscht werden',
        variant: 'destructive',
      });
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleWatchedChange = (eventId: string, watched: boolean) => {
    try {
      setEventWatched(eventId, watched);
      setWatchedEvents(prev => {
        const updated = { ...prev };
        if (watched) {
          updated[eventId] = true;
        } else {
          delete updated[eventId];
        }
        return updated;
      });
      toast({
        title: watched ? 'Als angesehen markiert' : 'Angesehen-Status entfernt',
        description: 'Status wurde erfolgreich aktualisiert',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Anime Tracker
          </h1>
          <p className="text-muted-foreground">
            Behalte deine Anime-Releases im Blick
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-muted rounded-lg" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        ) : animes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-500">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Noch keine Animes
              </h2>
              <p className="text-muted-foreground mb-6">
                Füge deinen ersten Anime hinzu, um Release-Termine zu verfolgen
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <Calendar events={events} onEventClick={handleEventClick} />
          </div>
        )}

        <AddAnimeModal onAddAnime={handleAddAnime} />
        <EventDetailModal
          event={selectedEvent}
          open={isEventModalOpen}
          onOpenChange={setIsEventModalOpen}
          onDelete={handleDeleteAnime}
          onWatchedChange={handleWatchedChange}
        />
        <Toaster />
      </div>
    </main>
  );
}

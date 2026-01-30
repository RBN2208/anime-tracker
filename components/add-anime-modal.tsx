"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { parseAnimeUrl } from "@/lib/url-parser";
import { Anime } from "@/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  url: z
    .string()
    .min(1, "URL ist erforderlich")
    .url("Ungültige URL")
    .refine(
      (url) => url.includes("aniworld.to"),
      "URL muss von aniworld.to sein"
    ),
  releaseInterval: z
    .number()
    .min(1, "Mindestens 1 Tag")
    .max(365, "Maximal 365 Tage"),
  startDate: z.string().min(1, "Startdatum ist erforderlich"),
  season: z.number().min(1, "Staffel muss mindestens 1 sein"),
  episodeStart: z.number().min(1, "Episode muss mindestens 1 sein"),
  maxEpisodes: z.number().min(1, "Episode muss mindestens 1 sein").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddAnimeModalProps {
  onAddAnime: (anime: Omit<Anime, "id" | "createdAt">) => void;
}

export function AddAnimeModal({ onAddAnime }: AddAnimeModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      releaseInterval: 7,
      startDate: new Date().toISOString().split("T")[0],
      season: 1,
      episodeStart: 1,
      maxEpisodes: undefined,
    },
  });

  // Parse URL and auto-fill fields
  const handleUrlBlur = () => {
    const url = form.getValues("url");
    if (url) {
      const parsed = parseAnimeUrl(url);
      if (parsed.season) {
        form.setValue("season", parsed.season);
      }
      if (parsed.episode) {
        form.setValue("episodeStart", parsed.episode);
      }
    }
  };

  const onSubmit = (data: FormData) => {
    try {
      const parsed = parseAnimeUrl(data.url);

      const anime: Omit<Anime, "id" | "createdAt"> = {
        title: parsed.title,
        sourceUrl: data.url,
        season: data.season,
        episodeStart: data.episodeStart,
        maxEpisodes: data.maxEpisodes,
        releaseInterval: data.releaseInterval,
        startDate: data.startDate,
      };

      onAddAnime(anime);

      // Show success toast
      toast({
        title: "Anime hinzugefügt",
        description: parsed.title
          ? `${parsed.title} wurde erfolgreich hinzugefügt`
          : "Anime wurde erfolgreich hinzugefügt",
      });

      // Reset form and close modal
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding anime:", error);
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Anime konnte nicht hinzugefügt werden",
        variant: "destructive",
      });
    }
  };

  // Auto-focus URL field when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const urlInput = document.querySelector(
          'input[name="url"]'
        ) as HTMLInputElement;
        if (urlInput) {
          urlInput.focus();
        }
      }, 0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50 md:h-16 md:w-16"
          aria-label="Anime hinzufügen"
        >
          <Plus className="h-6 w-6 md:h-7 md:w-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Anime hinzufügen</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    URL <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://aniworld.to/anime/stream/..."
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        handleUrlBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="releaseInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release-Intervall (Tage)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Erstes Release-Datum</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staffel</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="episodeStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start-Episode</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxEpisodes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximale Episodenanzahl (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="z.B. 12"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : parseInt(val, 10));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit">Hinzufügen</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ============================================================
 *  GERMAN FLASHCARD WORD GROUPS
 * ============================================================
 *  HOW TO ADD A NEW GROUP:
 *
 *  1. Copy the template block below
 *  2. Paste it inside the GROUPS array (before the last ] )
 *  3. Add a comma after the previous group's closing }
 *  4. Fill in your words
 *
 *  TEMPLATE:
 *  ─────────────────────────────────────
 *  {
 *    id: "your_unique_id",        // no spaces, use underscores
 *    name: "Your Group Name",     // shown in the app
 *    emoji: "🎯",                 // pick any emoji
 *    words: [
 *      { german: "das Wort", english: "the word", example: "Das ist ein Beispielsatz." },
 *      { german: "die Sprache", english: "the language", example: "Ich lerne eine neue Sprache." },
 *    ]
 *  },
 *  ─────────────────────────────────────
 *
 *  TIPS:
 *  - Always include der/die/das for nouns
 *  - Keep example sentences short and simple
 *  - Aim for 10–50 words per group
 *  - The emoji shows on the deck card in the home screen
 * ============================================================
 */

const GROUPS = [

  {
    id: "travel",
    name: "Travel",
    emoji: "✈️",
    words: [
      { german: "der Flughafen", english: "the airport", example: "Wir fahren zum Flughafen." },
      { german: "der Bahnhof", english: "the train station", example: "Der Bahnhof ist in der Stadtmitte." },
      { german: "das Ticket", english: "the ticket", example: "Ich kaufe ein Ticket nach Berlin." },
      { german: "der Koffer", english: "the suitcase", example: "Mein Koffer ist sehr schwer." },
      { german: "die Reise", english: "the trip / journey", example: "Die Reise dauert drei Stunden." },
      { german: "das Hotel", english: "the hotel", example: "Das Hotel liegt am Meer." },
      { german: "der Pass", english: "the passport", example: "Vergiss deinen Pass nicht!" },
      { german: "die Grenze", english: "the border", example: "Wir überqueren die Grenze um Mitternacht." },
      { german: "der Zug", english: "the train", example: "Der Zug fährt pünktlich ab." },
      { german: "das Visum", english: "the visa", example: "Ich brauche ein Visum für China." },
      { german: "die Abfahrt", english: "the departure", example: "Die Abfahrt ist um 9 Uhr." },
      { german: "die Ankunft", english: "the arrival", example: "Die Ankunft verzögert sich." },
      { german: "der Hafen", english: "the port / harbour", example: "Das Schiff liegt im Hafen." },
      { german: "die Reiseversicherung", english: "the travel insurance", example: "Eine Reiseversicherung ist wichtig." },
      { german: "die Landkarte", english: "the map", example: "Hast du eine Landkarte dabei?" },
    ]
  },

  {
    id: "household",
    name: "Household Items",
    emoji: "🏠",
    words: [
      { german: "der Stuhl", english: "the chair", example: "Der Stuhl steht am Tisch." },
      { german: "der Tisch", english: "the table", example: "Das Essen steht auf dem Tisch." },
      { german: "das Bett", english: "the bed", example: "Ich gehe früh ins Bett." },
      { german: "der Schrank", english: "the wardrobe / cupboard", example: "Meine Kleider hängen im Schrank." },
      { german: "das Fenster", english: "the window", example: "Bitte öffne das Fenster." },
      { german: "die Tür", english: "the door", example: "Die Tür ist abgeschlossen." },
      { german: "die Lampe", english: "the lamp", example: "Die Lampe gibt wenig Licht." },
      { german: "der Spiegel", english: "the mirror", example: "Er schaut in den Spiegel." },
      { german: "das Kissen", english: "the pillow / cushion", example: "Das Kissen ist sehr weich." },
      { german: "die Decke", english: "the blanket / ceiling", example: "Ich brauche eine warme Decke." },
      { german: "der Teppich", english: "the carpet / rug", example: "Der Teppich ist rot." },
      { german: "das Regal", english: "the shelf / bookcase", example: "Die Bücher stehen im Regal." },
      { german: "die Badewanne", english: "the bathtub", example: "Ich nehme ein Bad in der Badewanne." },
      { german: "der Herd", english: "the stove / cooker", example: "Der Herd ist sehr heiß." },
      { german: "die Spülmaschine", english: "the dishwasher", example: "Die Spülmaschine läuft gerade." },
    ]
  },

  {
    id: "cooking",
    name: "Cooking & Kitchen",
    emoji: "🍳",
    words: [
      { german: "kochen", english: "to cook", example: "Ich koche jeden Abend." },
      { german: "das Rezept", english: "the recipe", example: "Hast du ein gutes Rezept?" },
      { german: "die Pfanne", english: "the frying pan", example: "Die Pfanne ist zu heiß." },
      { german: "der Topf", english: "the pot", example: "Das Wasser kocht im Topf." },
      { german: "das Messer", english: "the knife", example: "Pass auf das scharfe Messer auf." },
      { german: "der Löffel", english: "the spoon", example: "Rühr die Suppe mit dem Löffel um." },
      { german: "die Gabel", english: "the fork", example: "Die Gabel liegt neben dem Teller." },
      { german: "das Salz", english: "the salt", example: "Kannst du mir das Salz geben?" },
      { german: "der Pfeffer", english: "the pepper", example: "Ich mag viel Pfeffer auf meiner Pizza." },
      { german: "das Öl", english: "the oil", example: "Erhitze das Öl in der Pfanne." },
      { german: "der Backofen", english: "the oven", example: "Stelle den Backofen auf 200 Grad." },
      { german: "braten", english: "to fry / roast", example: "Ich b
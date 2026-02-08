export interface AnimeCharactersResponse {
  data: AnimeCharacter[];
}

export interface AnimeCharacter {
  character: AnimeCharacterData;
  role: string;
  voice_actors: VoiceActor[];
}

export interface AnimeCharacterData {
  mal_id: number;
  url: string;
  images: CharacterImages;
  name: string;
}

export interface CharacterImages {
  jpg: Jpg;
  webp: Webp;
}

export interface Jpg {
  image_url: string;
  small_image_url: string;
}

export interface Webp {
  image_url: string;
  small_image_url: string;
}

export interface VoiceActor {
  person: Person;
  language: string;
}

export interface Person {
  mal_id: number;
  url: string;
  images: VoiceActorImages;
  name: string;
}

export interface VoiceActorImages {
  jpg?: string;
}

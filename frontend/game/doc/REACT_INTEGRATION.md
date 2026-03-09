# Intégration dans un projet React

## 1. Installer la dépendance locale

Depuis la **racine de votre projet React** :

```bash
# Option A — chemin relatif (recommandé en dev)
npm install ../ft_transcendence_front

# Option B — npm link (si les repos ne sont pas côte à côte)
cd /chemin/vers/ft_transcendence_front && npm link
cd /chemin/vers/mon-projet-react && npm link ft_transcendence_front
```

> **Note :** après chaque modification dans ce repo, relancez `npm run build` ici pour que les changements soient visibles côté React.

---

## 2. Copier le composant wrapper

Copiez le fichier `react/KongGameComponent.tsx` dans votre projet React, par exemple dans `src/components/KongGameComponent.tsx`.

---

## 3. Utilisation basique

```tsx
import { KongGameComponent } from "./components/KongGameComponent";

function App() {
  return (
    <KongGameComponent
      wsUrl="ws://localhost:3000/ws"
      userToken={localStorage.getItem("token") || ""}
      userId="user-123"
      width={800}
      height={600}
      onConnected={() => console.log("Connecté !")}
      onError={(err) => console.error("Erreur:", err)}
    />
  );
}
```

---

## 4. Utilisation avancée (hook)

Pour un contrôle impératif (créer/rejoindre une partie depuis un bouton React) :

```tsx
import { useKongGame } from "./components/KongGameComponent";

function GamePage() {
  const { containerRef, init, destroy } = useKongGame();

  const handleStart = () => {
    const game = init({
      wsUrl: "ws://localhost:3000/ws",
      userToken: "mon-token",
      userId: "user-123",
    });
    if (game) {
      game.on("authenticated", () => console.log("Auth OK"));
      game.start();
    }
  };

  return (
    <div>
      <button onClick={handleStart}>Lancer le jeu</button>
      <button onClick={destroy}>Arrêter</button>
      <div ref={containerRef} />
    </div>
  );
}
```

---

## 5. Props disponibles

| Prop                   | Type       | Défaut | Description                          |
|------------------------|------------|--------|--------------------------------------|
| `wsUrl`                | `string`   | —      | URL du WebSocket serveur             |
| `userToken`            | `string`   | —      | Token d'authentification             |
| `userId`               | `string`   | —      | Identifiant utilisateur              |
| `width`                | `number`   | 800    | Largeur du canvas                    |
| `height`               | `number`   | 600    | Hauteur du canvas                    |
| `autoStart`            | `boolean`  | true   | Démarrer automatiquement             |
| `className`            | `string`   | —      | Classe CSS sur le conteneur          |
| `interpolationDelay`   | `number`   | 0.25   | Vitesse d'interpolation (0-1)        |
| `maxReconnectAttempts` | `number`   | 5      | Tentatives de reconnexion            |
| `reconnectDelay`       | `number`   | 1000   | Délai entre reconnexions (ms)        |

### Événements (callbacks)

| Prop                | Payload                                      |
|---------------------|----------------------------------------------|
| `onConnected`       | `void`                                       |
| `onDisconnected`    | `{ code: number; reason: string }`           |
| `onReconnecting`    | `{ attempt: number; maxAttempts: number }`   |
| `onReconnectFailed` | `void`                                       |
| `onAuthenticated`   | `AuthResponseMessage`                        |
| `onGameState`       | `KongGameState`                              |
| `onGameCreated`     | `{ type: "gameCreated"; gameId: string }`    |
| `onGameJoined`      | `{ type: "gameJoined"; gameId: string }`     |
| `onError`           | `string`                                     |

---

## 6. Assets

Les images (`/assets/face.png`, `/assets/baril.png`) sont chargées par le renderer via des chemins absolus. Copiez le dossier `assets/` de ce repo dans le dossier `public/` de votre projet React pour qu'elles soient servies correctement.

```
mon-projet-react/
  public/
    assets/
      face.png
      baril.png
```

---

## 7. Résumé des fichiers à copier

| Source (ce repo)                  | Destination (projet React)                |
|-----------------------------------|-------------------------------------------|
| `react/KongGameComponent.tsx`     | `src/components/KongGameComponent.tsx`     |
| `assets/`                         | `public/assets/`                           |

Le reste est géré par `npm install ../ft_transcendence_front` — pas besoin de copier le code source.

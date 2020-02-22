    let CACHE_NAME = 'my-site-cache-v1';
    let urlsToCache = [
      '/',
      '/app.js',
      '/src/buildings.js',
      '/src/items.js',
      '/src/nipplejs.js',
      '/src/recipes.js',
      '/src/simplex.js',
      '/src/terrain.js',
      '/src/utils.js',
      '/src/classes/boat.js',
      '/src/classes/craftableItem.js',
      '/src/classes/droppedItem.js',
      '/src/classes/gameMap.js',
      '/src/classes/item.js',
      '/src/classes/map.js',
      '/src/classes/mapGenerator.js',
      '/src/classes/mapRenderer.js',
      '/src/classes/player.js',
      '/src/classes/spritesheet.js',
      '/src/classes/tile.js',
      '/src/classes/treasure.js',
      '/src/classes/uiRenderer.js',
      '/assets/Pixelated.woff',
      '/assets/img/action_button.png',
      '/assets/img/axe.png',
      '/assets/img/barrier.png',
      '/assets/img/blueberry.png',
      '/assets/img/completed_map.png',
      '/assets/img/crafting_menu.png',
      '/assets/img/forest.png',
      '/assets/img/grass_1.png',
      '/assets/img/grass_2.png',
      '/assets/img/hammer.png',
      '/assets/img/logs.png',
      '/assets/img/map_menu.png',
      '/assets/img/map_piece1.png',
      '/assets/img/map_piece2.png',
      '/assets/img/map_piece3.png',
      '/assets/img/map-border.png',
      '/assets/img/pick.png',
      '/assets/img/player.png',
      '/assets/img/raft.png',
      '/assets/img/rock.png',
      '/assets/img/rocks.png',
      '/assets/img/sand.png',
      '/assets/img/shovel.png',
      '/assets/img/toggle_button.png',
      '/assets/img/treasure.png',
      '/assets/img/water.png',
      '/assets/img/world_map.png',
    ];
    
    self.addEventListener('install', function(event) {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(function(cache) {
            return cache.addAll(urlsToCache);
          })
      );
    });
    

    self.addEventListener('fetch', function(event) {
        event.respondWith(
          caches.match(event.request)
            .then(function(response) {
              // Cache hit - return response
              if (response) {
                return response;
              }
              return fetch(event.request);
            }
          )
        );
      });
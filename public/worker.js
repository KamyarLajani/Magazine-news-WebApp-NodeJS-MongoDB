self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
    
  );
});


self.addEventListener('push', ev => {
  const data = ev.data.json();
  
  let logo = `${self.location.origin}/uploads/${data.logo}`;
  let articleUrl = `${self.location.origin}/article/${data.articleUrl}`;
   return self.registration.showNotification(data.title, {
    
    body: data.body,
    icon: logo,
    data: {
      url: articleUrl
    }
  });
  
});


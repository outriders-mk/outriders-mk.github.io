function addXDay(date, X) {
            const result = new Date(date);
            result.setDate(result.getDate() + X);
            return new Date(result.toString());
        }

        function fetch_events(upcoming) {
            fetch('/assets/events.json')
                .then(response => response.json())
                .then(data => {
                    const eventsContainer = document.getElementById('upcoming_events');
                    // sort by start_date (fallback to end_date) ascending
                    data.sort((a, b) => {
                        const da = new Date(a.start_date || a.end_date);
                        const db = new Date(b.start_date || b.end_date);
                        const na = isNaN(da);
                        const nb = isNaN(db);
                        if (na && nb) return 0;
                        if (na) return 1;
                        if (nb) return -1;
                        return da - db;
                    });
                    data.forEach(event => {
                        const isOlderThan3 = new Date(event.start_date) < addXDay(new Date(), -3);
                        let skip;
                        if(upcoming) {
                            skip = isOlderThan3
                        } else {
                            skip = !isOlderThan3;
                        }
                        
                        
                        if(skip) {
                            return; // Skip past events
                        }
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'div-event';
                        eventDiv.innerHTML = `<h3>${event.name}</h3>`;
                        if (!('end_date' in event)) {
                            eventDiv.innerHTML += `<p>Date: ${event.start_date}`;
                            eventsContainer.appendChild(eventDiv);
                        } else {
                            
                            eventDiv.innerHTML += `<p>From: ${event.start_date} To: ${event.end_date}</p>`;
                            eventsContainer.appendChild(eventDiv);
                        }
                        if(event.links) {
                            const linksList = document.createElement('ul');
                            event.links.forEach(link => {
                                const linkItem = document.createElement('li');
                                linkItem.innerHTML = `<a href="${link.url}">${link.label}</a>`;
                                linksList.appendChild(linkItem);
                            });
                            eventDiv.appendChild(linksList);
                        }
                        if(event.additional_info) {
                            event.additional_info.forEach(info => {
                                const infoPara = document.createElement('p');
                                const strong = document.createElement('strong');
                                strong.textContent = `${info.label}: `;
                                infoPara.appendChild(strong);
                                infoPara.appendChild(document.createTextNode(info.value));
                                eventDiv.appendChild(infoPara);
                            });
                            
                        }
                    });
                })
                .catch(error => console.error('Error fetching events:', error));
        }
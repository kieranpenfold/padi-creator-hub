insert into creators (name, categories, country, description, tags, avatar_url, cover_url)
values ('Ocean Kay', ARRAY['Influencer','Photographer'], 'UK', 'Underwater storyteller and conservation advocate.', ARRAY['underwater','macro','conservation'], 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200');

insert into social_links (creator_id, platform, url)
select id, 'instagram', 'https://instagram.com/ocean_kay' from creators where name = 'Ocean Kay';

insert into ratings (creator_id, stars, rater_name, comment)
select id, 4.5, 'PADI Team', 'Strong EMEA reach, great briefs.' from creators where name = 'Ocean Kay';

insert into work_items (creator_id, title, campaign, status, start_date, end_date, deliverables, links)
select id, 'Red Sea Clean-up', 'Save the Ocean', 'Completed', '2024-05-01', '2024-05-15', ARRAY['IG Reel','YT Video'], ARRAY['https://example.com/post']
from creators where name = 'Ocean Kay';

insert into notes (creator_id, author, body)
select id, 'PADI Team', 'Interested in Malta shoot 2025.' from creators where name = 'Ocean Kay';

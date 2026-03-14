-- Demo issues (for testing without auth)
insert into public.issues (id, reported_by, title, description, lat, lng, address, issue_type, severity, urgency_score, volunteers_needed, status)
values
  (uuid_generate_v4(), null, 'Large garbage dump near park', 'Huge pile of garbage near the entrance of the park, very unhygienic', 12.9716, 77.5946, 'MG Road, Bengaluru', 'garbage', 'high', 8, 3, 'open'),
  (uuid_generate_v4(), null, 'Pothole on main road', 'Deep pothole causing accidents near the signal', 12.9352, 77.6245, 'Koramangala, Bengaluru', 'pothole', 'critical', 9, 2, 'open'),
  (uuid_generate_v4(), null, 'Broken streetlight', 'Streetlight not working for 2 weeks, very dark at night', 12.9542, 77.4908, 'Rajajinagar, Bengaluru', 'streetlight', 'medium', 5, 1, 'open'),
  (uuid_generate_v4(), null, 'Drainage overflow', 'Drainage overflowing onto the road causing bad smell', 12.9850, 77.5533, 'Hebbal, Bengaluru', 'drainage', 'high', 7, 4, 'in_progress'),
  (uuid_generate_v4(), null, 'Illegal dumping site', 'People dumping construction waste on the roadside', 12.9165, 77.6101, 'HSR Layout, Bengaluru', 'garbage', 'medium', 6, 2, 'open');
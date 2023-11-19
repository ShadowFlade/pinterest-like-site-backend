## Cron Functionality

It should run once a minute (my current crontab job looks like this

```
* * * * * (cd /home/shadowflade/Desktop/personal/projects/pinterest-like-site-backend && /usr/bin/node /home/shadowflade/Desktop/personal/projects/pinterest-like-site-backend/cron/postponed_pin.js) >> /home/shadowflade/Desktop/cron_logs/postponed_pin.log 2>&1)
```

`cd` is for fixing problem with `dotenv` plugin (or rather `node` problem) with `cwd`.
Also there is logging out everything to a file.

## Nodemon functionality

Also you can just exec the file with nodemon like this `nodemon scheduled_jobs/postponed_pin2.js > text2.txt 2>&1` for example. Don't forget that the main server should be up for this to work, so it should be `nodemon index.js & && nodemon cron/postponed_pin2.js`

## Functionality

Can there be an issue, if we grabbed very many posts and cant update them all in once (in 1 minute?). Then it will not be available () at the time when it should've been published, but the DATE_PUBLISHED will say the 'correct' time (equal to DATE_TO_PUBLISH, not actual PUBLISHED).
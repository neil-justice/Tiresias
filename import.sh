#!/bin/bash
eval $(echo "mongorestore --drop --db tiresias mongobackup/tiresias/predictions.bson")
eval $(echo "mongorestore --drop --db tiresias mongobackup/tiresias/users.bson")
eval $(echo "mongorestore --drop --db tiresias mongobackup/tiresias/stats.bson")
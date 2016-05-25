#!/bin/bash
eval $(echo "mongorestore --drop --db tiresias mongobackup/tiresias/predictions.bson")
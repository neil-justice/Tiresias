#!/bin/bash
eval $(echo "mongorestore --drop --collection predictions --db tiresias mongobackup/tiresias/predictions.bson")
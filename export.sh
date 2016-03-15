#!/bin/bash
eval $(echo "mongodump --collection predictions --db tiresias --out mongobackup/")
#!/bin/bash

base='http://web.mit.edu/aaronlin/www/set/cardimgs/'
zero='0'
ending='.gif'

for i in {1..9}
do
    curl -O $base$zero$i$ending
done

for i in {10..81}
do 
    curl -O $base$i$ending
done

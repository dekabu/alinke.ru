#!/bin/sh

DB=../db.json

LEN=`cat $DB | wc -l`

cp $DB $DB.old

cat $DB.old | head -$(($LEN - 3)) > $DB

echo "},

{
	\"title\": \"TITLE\",
	\"id\": \"ID\",
	\"text\": [" >> $DB

COMMA=
while IFS= read -r line; do
	if [ $COMMA ]; then
		echo , >> $DB
	else
		COMMA=1
	fi
	echo -en "\t\t\"$line\"" >> $DB
done < text

echo "
 ]
}

]" >> $DB

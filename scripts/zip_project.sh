#!/bin/bash

cd ..

zip -r backend.zip . -x "scripts/*" -x "node_modules/*" -x "dist/*"

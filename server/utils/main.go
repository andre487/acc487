package utils

import "log"

func Must[T any](obj T, err error) T {
	if err != nil {
		panic(err)
	}
	return obj
}

func Must0(err error) {
	if err != nil {
		panic(err)
	}
}

func WarnIfError(err error) {
	if err != nil {
		log.Printf("Warning: %s\n", err)
	}
}

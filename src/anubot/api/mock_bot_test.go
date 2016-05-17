// This file was generated by github.com/nelsam/hel.  Do not
// edit this code by hand unless you *really* know what you're
// doing.  Expect any changes made manually to be overwritten
// the next time hel regenerates this file.

package api_test

import "anubot/bot"

type mockBot struct {
	ConnectCalled chan bool
	ConnectInput  struct {
		ConnConfig chan *bot.ConnConfig
	}
	ConnectOutput struct {
		Err          chan error
		Disconnected chan chan struct{}
	}
	DisconnectCalled chan bool
}

func newMockBot() *mockBot {
	m := &mockBot{}
	m.ConnectCalled = make(chan bool, 100)
	m.ConnectInput.ConnConfig = make(chan *bot.ConnConfig, 100)
	m.ConnectOutput.Err = make(chan error, 100)
	m.ConnectOutput.Disconnected = make(chan chan struct{}, 100)
	m.DisconnectCalled = make(chan bool, 100)
	return m
}
func (m *mockBot) Connect(connConfig *bot.ConnConfig) (err error, disconnected chan struct{}) {
	m.ConnectCalled <- true
	m.ConnectInput.ConnConfig <- connConfig
	return <-m.ConnectOutput.Err, <-m.ConnectOutput.Disconnected
}
func (m *mockBot) Disconnect() {
	m.DisconnectCalled <- true
}
package bot

import "github.com/fluffle/goirc/client"

type ChatFeature struct {
	writer     FeatureWriter
	dispatcher Dispatcher
}

func NewChatFeature(writer FeatureWriter, dispatcher Dispatcher) *ChatFeature {
	return &ChatFeature{
		writer:     writer,
		dispatcher: dispatcher,
	}
}

func (cf *ChatFeature) Register() {
	cf.writer.HandleFunc("bot", "PRIVMSG", cf.ChatHandler("bot"))
	cf.writer.HandleFunc("streamer", "PRIVMSG", cf.ChatHandler("streamer"))
}

func (cf *ChatFeature) Send(user, message string) {
	cf.writer.Privmsg(user, cf.writer.Channel(), message)
}

func (cf *ChatFeature) ChatHandler(user string) func(*client.Conn, *client.Line) {
	return func(conn *client.Conn, line *client.Line) {
		target := line.Args[0]

		// don't accept messages sent to the streamer conn for the current
		// channel
		if target == cf.writer.Channel() && user == "streamer" {
			return
		}

		// TODO: Args might not always exist
		msg := Message{
			Nick:   line.Nick,
			Target: target,
			Body:   line.Args[1],
			Time:   line.Time,
		}
		WriteMessageID(&msg)
		cf.dispatcher.Dispatch(msg)
	}
}

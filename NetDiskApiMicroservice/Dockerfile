FROM debian:12

RUN apt-get update && apt-get -y install pgpool2

RUN echo 'sleep infinity' >> /bootstrap.sh

RUN chmod +x /bootstrap.sh

CMD /bootstrap.sh
# User Service UI

Angular UI for user service.

## Deployment

You can deploy the service for local testing on either
[minikube](https://minikube.sigs.k8s.io/docs/) or  Docker Desktop. This can be
done with the help of an [Helm](https://helm.sh/) chart.

Create a new test environment:

```shell
minikube start --network-plugin=cni --memory=8192mb --cpus=4
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml
kubectl label namespace default istio-injection=enabled
istioctl install -y --set meshConfig.defaultConfig.holdApplicationUntilProxyStarts=true
```

You can add some tools:

```shell
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/kiali.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/prometheus.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/grafana.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/jaeger.yaml
```

They can be accessed with with the dashboard subcommand:

```shell
istioctl dashboard kiali
```
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = file("model-shelter-385621-13148380303b.json")

  project = "model-shelter-385621"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "google_compute_network" "my_access" {
  name = "my-access"
}

resource "google_compute_firewall" "my_ssh" {
  name = "allow-my-ssh"
  allow {
    ports    = ["22"]
    protocol = "tcp"
  }
  direction     = "INGRESS"
  network       = google_compute_network.my_access.id
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ssh"]
}

resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"
  tags         = ["web", "dev"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  metadata_startup_script = <<-EOT
  sudo apt-get update;
  sudo apt-get install -yq build-essential python3-pip rsync;
  pip install flask
  EOT

  metadata = {
    ssh-keys = "teemo:${file("/Users/eileen/.ssh/id_ed25519.pub")}"
  }

  # allow_stopping_for_update = true

  network_interface {
    network = google_compute_network.my_access.name
    access_config {
    }
  }
}

output "SSH-IP" {
  value = join("", ["http://", google_compute_instance.vm_instance.network_interface.0.access_config.0.nat_ip, ":22"])
}
// A variable for extracting the external IP address of the VM

# output "Web-server-URL" {
#  value = join("",["http://",google_compute_instance.default.network_interface.0.access_config.0.nat_ip,":5000"])
# }
